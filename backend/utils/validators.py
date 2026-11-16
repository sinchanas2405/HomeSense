def clean_text(value,limit=200): return str(value or '').strip()[:limit]
def valid_email(value): return isinstance(value,str) and '@' in value and '.' in value.split('@')[-1]
