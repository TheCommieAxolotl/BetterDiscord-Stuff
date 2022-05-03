#!/usr/bin/env python3

"""
This is a simple tool to auto-update Discord themes.
Note: It performs a basic string replace, so any uses of Discord classes
      outside of selectors will be updated. However, Discord classes are
      fairly unique so this should not be an issue.
"""

import os
import sys
import traceback

if len(sys.argv) < 2:
    print("USAGE:")
    print("  python update.py theme.css")
    print("  python update.py theme1.css theme2.css theme3.css ...")
    print("  python update.py *.css")
    exit(1)

replacements = {}
with open(
    os.path.join(os.path.dirname(os.path.realpath((__file__))), "differences.csv"),
    mode="r",
) as f:
    for line in f.readlines():
        classes = line[:-1].split(",")
        for old in classes[:-1]:
            replacements[old] = classes[-1]


for name in sys.argv[1:]:
    try:
        with open(name, mode="r") as f:
            content = f.read()

        for old, new in replacements.items():
            content = content.replace(old, new)

        with open(name, mode="w") as f:
            f.write(content)

        print("Successfully updated " + name + "!")

    except Exception as e:
        print("Error handling file " + name + ":")
        traceback.print_exc()