# Filename Generation Examples

This document shows examples of how the extension generates filenames for screenshots.

## Format
```
{site-name}-{YYYYMMDD-HHMMSS}.png
```

## Examples

| Page Title | Generated Filename (example) |
|------------|------------------------------|
| "Google Search" | `google-search-20260203-143025.png` |
| "GitHub - Where the world builds software" | `github-where-the-world-builds-software-20260203-143026.png` |
| "Stack Overflow - Questions & Answers" | `stack-overflow-questions-answers-20260203-143027.png` |
| "News Article - Breaking News Today!" | `news-article-breaking-news-today-20260203-143028.png` |
| "My Awesome Website" | `my-awesome-website-20260203-143029.png` |

## Rules Applied

1. **Special characters removed**: Only alphanumeric characters and spaces are kept
2. **Spaces replaced**: All spaces are replaced with dashes (-)
3. **Lowercase conversion**: The entire site name is converted to lowercase
4. **Length limit**: Site names longer than 50 characters are truncated
5. **Timestamp format**: YYYYMMDD-HHMMSS (includes year, month, day, hour, minute, second)

## Edge Cases

- Empty page title → Uses "screenshot" as the default name
- Very long titles → Truncated to 50 characters
- Titles with only special characters → Becomes "screenshot"
- Duplicate filenames → Prevented by including seconds in timestamp
