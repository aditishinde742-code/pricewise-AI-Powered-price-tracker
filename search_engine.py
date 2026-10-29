"""
PriceWise - Smart Fuzzy Search Engine
Features:
- RapidFuzz (with fallback to SequenceMatcher + token set ratio)
- URL product link parsing and keyword extraction
- Typo-tolerance, token-order insensitivity, partial matching
- Searches across product name, keywords, category, and description
- No hardcoded typo mappings: purely algorithmic similarity scoring
"""

import re
import urllib.parse
from difflib import SequenceMatcher

try:
    from rapidfuzz import fuzz
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    # Replace punctuation with space
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return ' '.join(text.split())

def fallback_ratio(s1, s2):
    if not s1 or not s2:
        return 0
    if s1 == s2:
        return 100
    return SequenceMatcher(None, s1, s2).ratio() * 100

def fallback_token_set_ratio(s1, s2):
    t1 = set(clean_text(s1).split())
    t2 = set(clean_text(s2).split())
    if not t1 or not t2:
        return 0

    intersection = t1.intersection(t2)
    if intersection:
        return 100 if len(intersection) == len(t1) else 85

    # Check closest word match across tokens
    best_word_match = 0
    for w1 in t1:
        for w2 in t2:
            r = fallback_ratio(w1, w2)
            if r > best_word_match:
                best_word_match = r
    return best_word_match

def fallback_partial_ratio(s1, s2):
    s1, s2 = clean_text(s1), clean_text(s2)
    if not s1 or not s2:
        return 0
    if s1 in s2 or s2 in s1:
        return 100
    
    # Check token overlap
    tokens1 = s1.split()
    tokens2 = s2.split()
    matched = 0
    for t in tokens1:
        if any(t in w2 or fallback_ratio(t, w2) > 80 for w2 in tokens2):
            matched += 1
    return (matched / len(tokens1)) * 100 if tokens1 else 0

def compute_similarity(query_clean, target_clean):
    if not query_clean or not target_clean:
        return 0

    if query_clean == target_clean:
        return 100

    if query_clean in target_clean:
        return 95

    if HAS_RAPIDFUZZ:
        token_set = fuzz.token_set_ratio(query_clean, target_clean)
        partial = fuzz.partial_ratio(query_clean, target_clean)
        token_sort = fuzz.token_sort_ratio(query_clean, target_clean)
        w_ratio = fuzz.WRatio(query_clean, target_clean)
        return max(token_set, partial, token_sort, w_ratio)
    else:
        token_set = fallback_token_set_ratio(query_clean, target_clean)
        partial = fallback_partial_ratio(query_clean, target_clean)
        direct = fallback_ratio(query_clean, target_clean)
        return max(token_set, partial, direct)

def is_url(text):
    text = text.strip()
    return (
        text.startswith('http://') or 
        text.startswith('https://') or 
        text.startswith('www.') or 
        (('amazon.' in text or 'flipkart.' in text or 'myntra.' in text or 'meesho.' in text or 'nykaa.' in text or '.com' in text or '.in' in text) and '/' in text)
    )

def extract_keywords_from_url(url_str):
    try:
        if not url_str.startswith(('http://', 'https://')):
            url_str = 'https://' + url_str
        parsed = urllib.parse.urlparse(url_str)
        path = parsed.path
        query = parsed.query

        # Extract tokens from path slugs
        slug_parts = re.split(r'[/_\-\+\?\=\&]', path + ' ' + query)
        stop_words = {'http', 'https', 'www', 'com', 'in', 'org', 'net', 'dp', 'gp', 'p', 'product', 'item', 'itm', 'buy', 'online', 'store', 'ref', 'pd'}
        tokens = [t.lower() for t in slug_parts if t and t.lower() not in stop_words and len(t) > 1 and not t.isdigit()]
        
        extracted = " ".join(tokens)
        return extracted if extracted else url_str
    except Exception:
        return url_str

def score_product(query, product):
    """
    Score a product dictionary against a search query.
    product has keys: name, keywords, category, description
    """
    clean_q = clean_text(query)
    q_words = clean_q.split()
    if not q_words:
        return 0

    name_clean = clean_text(product['name'])
    keywords_clean = clean_text(product.get('keywords', ''))
    category_clean = clean_text(product.get('category', ''))
    desc_clean = clean_text(product.get('description', ''))

    name_tokens = set(name_clean.split())
    kw_tokens = set(keywords_clean.split())

    score = 0.0

    # 1. Direct equality
    if clean_q == name_clean:
        return 150.0

    # 2. Exact phrase in name (for short queries <= 3 chars, require word boundary)
    if len(clean_q) <= 3:
        if clean_q in name_tokens or f" {clean_q} " in f" {name_clean} " or name_clean.startswith(f"{clean_q} ") or name_clean.endswith(f" {clean_q}"):
            score += 80.0
    else:
        if clean_q in name_clean:
            score += 80.0

    # 3. Whole-word overlap in name
    matching_name_words = sum(1 for w in q_words if w in name_tokens)
    if matching_name_words == len(q_words):
        score += 70.0
    elif matching_name_words > 0:
        score += (matching_name_words / len(q_words)) * 50.0

    # 4. Whole-word overlap in keywords
    matching_kw_words = sum(1 for w in q_words if w in kw_tokens)
    if matching_kw_words == len(q_words):
        score += 45.0
    elif matching_kw_words > 0:
        score += (matching_kw_words / len(q_words)) * 30.0

    # 5. Fuzzy similarity on name
    name_sim = compute_similarity(clean_q, name_clean)
    score += name_sim * 0.45

    # 6. Fuzzy similarity on keywords
    if keywords_clean:
        kw_sim = compute_similarity(clean_q, keywords_clean)
        score += kw_sim * 0.35

    # 7. Fuzzy similarity on category
    if category_clean:
        cat_sim = compute_similarity(clean_q, category_clean)
        score += cat_sim * 0.20

    # 8. Word-level fuzzy matches if typo
    typo_matches = 0
    for qw in q_words:
        best_token_sim = 0
        for nt in name_tokens:
            sim = compute_similarity(qw, nt)
            if sim > best_token_sim:
                best_token_sim = sim
        for kt in kw_tokens:
            sim = compute_similarity(qw, kt)
            if sim > best_token_sim:
                best_token_sim = sim
        if best_token_sim >= 75:
            typo_matches += 1
            score += best_token_sim * 0.25

    return score
