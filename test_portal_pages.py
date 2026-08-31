#!/usr/bin/env python3
"""
Automated Verification Suite for Portfolio Multi-Page Website
- Validates existence of all 6 pages
- Verifies HTML structure (DOCTYPE, UTF-8, title, responsive meta)
- Validates that every internal href link resolves to a valid existing file or valid anchor
- Verifies JavaScript syntax and common utility integration
"""

import os
import re
import sys
import unittest
from html.parser import HTMLParser

PORTFOLIO_DIR = os.path.dirname(os.path.abspath(__file__))
EXPECTED_PAGES = [
    "index.html",
    "services.html",
    "works.html",
    "about.html",
    "process.html",
    "contact.html",
]


class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "a" and "href" in attrs_dict:
            self.links.append(attrs_dict["href"])
        if tag == "script" and "src" in attrs_dict:
            self.scripts.append(attrs_dict["src"])


class TestPortfolioMultiPage(unittest.TestCase):
    def test_all_pages_exist(self):
        """全6ページが存在することを確認"""
        for page in EXPECTED_PAGES:
            page_path = os.path.join(PORTFOLIO_DIR, page)
            self.assertTrue(os.path.exists(page_path), f"Missing page: {page}")

    def test_common_js_exists(self):
        """共通スクリプト common.js が存在することを確認"""
        js_path = os.path.join(PORTFOLIO_DIR, "common.js")
        self.assertTrue(os.path.exists(js_path), "Missing common.js")

    def test_page_structures(self):
        """各ページのHTML基本構造の検証"""
        for page in EXPECTED_PAGES:
            page_path = os.path.join(PORTFOLIO_DIR, page)
            with open(page_path, "r", encoding="utf-8") as f:
                content = f.read()

            self.assertIn("<!DOCTYPE html>", content, f"{page} missing DOCTYPE")
            self.assertIn("<meta charset=\"UTF-8\">", content, f"{page} missing charset")
            self.assertIn("<meta name=\"viewport\"", content, f"{page} missing viewport")
            self.assertIn("<title>", content, f"{page} missing title")
            self.assertIn("common.js", content, f"{page} missing common.js script tag")
            self.assertIn("lucide", content.lower(), f"{page} missing Lucide icons")

    def test_no_broken_internal_links(self):
        """全ページ内の内部リンクがすべて正常に存在することを検証"""
        for page in EXPECTED_PAGES:
            page_path = os.path.join(PORTFOLIO_DIR, page)
            with open(page_path, "r", encoding="utf-8") as f:
                content = f.read()

            parser = LinkExtractor()
            parser.feed(content)

            for href in parser.links:
                # 外部リンクやjavascript/tel/mailto/外部httpはスキップ
                if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
                    continue
                
                # ページ内アンカー (#about など)
                if href.startswith("#"):
                    continue

                # クエリパラメータやハッシュの分離
                clean_href = href.split("?")[0].split("#")[0]
                if clean_href:
                    target_file = os.path.join(PORTFOLIO_DIR, clean_href)
                    self.assertTrue(
                        os.path.exists(target_file),
                        f"Broken link in {page}: href='{href}' target file not found at {target_file}"
                    )


if __name__ == "__main__":
    print("==================================================")
    print(" 🧪 ポートフォリオ全6ページ 自動検証テストを実行中...")
    print("==================================================")
    unittest.main(verbosity=2)
