#!/usr/bin/env python3
"""MCP server for reading and updating checklists in docs/*.md."""

import sys, os, json, re

DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")

def read_checklist(path: str) -> list:
    """Read all checklist items from a markdown file."""
    full_path = path if os.path.isabs(path) else os.path.join(DOCS_DIR, path)
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"File not found: {full_path}")

    with open(full_path, "r") as f:
        content = f.read()

    items = []
    for line in content.split("\n"):
        m = re.match(r"^\s*-\s*(\[.\])\s*(.*)", line)
        if m:
            items.append({
                "checked": m.group(1) == "[x]",
                "text": m.group(2).strip(),
                "line": line,
            })
    return items

def update_checklist(path: str, item_text: str, checked: bool) -> dict:
    """Mark a checklist item as done or undone by matching its text."""
    full_path = path if os.path.isabs(path) else os.path.join(DOCS_DIR, path)
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"File not found: {full_path}")

    with open(full_path, "r") as f:
        content = f.read()

    marker = "[x]" if checked else "[ ]"
    lines = content.split("\n")
    matched = 0
    for i, line in enumerate(lines):
        m = re.match(r"^(\s*-\s*\[.\]\s*)(.*)", line)
        if m and m.group(2).strip() == item_text:
            lines[i] = f"{m.group(1).replace('[ ]', marker).replace('[x]', marker)}{m.group(2)}"
            matched += 1

    if matched == 0:
        raise ValueError(f"No checklist item found matching: {item_text}")

    content = "\n".join(lines)
    with open(full_path, "w") as f:
        f.write(content)

    return {"updated": matched, "file": full_path}


def handle_request(request):
    req = json.loads(request)
    req_id = req.get("id", 0)
    method = req.get("method", "")
    params = req.get("params", {})

    if method == "initialize":
        return json.dumps({
            "jsonrpc": "2.0", "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "checklist", "version": "0.1.0"},
            }
        })

    elif method == "tools/list":
        return json.dumps({
            "jsonrpc": "2.0", "id": req_id,
            "result": {
                "tools": [
                    {
                        "name": "read_checklist",
                        "description": "Read all checklist items from a machine docs file",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "path": {"type": "string", "description": "Filename (e.g. commodore-64.md) or absolute path"},
                            },
                            "required": ["path"]
                        }
                    },
                    {
                        "name": "check_item",
                        "description": "Mark a checklist item as done",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "path": {"type": "string", "description": "Filename or absolute path"},
                                "item_text": {"type": "string", "description": "Text of the checklist item to mark"},
                            },
                            "required": ["path", "item_text"]
                        }
                    },
                    {
                        "name": "uncheck_item",
                        "description": "Mark a checklist item as not done",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "path": {"type": "string", "description": "Filename or absolute path"},
                                "item_text": {"type": "string", "description": "Text of the checklist item to unmark"},
                            },
                            "required": ["path", "item_text"]
                        }
                    },
                ]
            }
        })

    elif method == "tools/call":
        tool_name = params.get("name", "")
        args = params.get("arguments", {})

        try:
            if tool_name == "read_checklist":
                items = read_checklist(args["path"])
                done = sum(1 for i in items if i["checked"])
                return json.dumps({
                    "jsonrpc": "2.0", "id": req_id,
                    "result": {
                        "content": [{
                            "type": "text",
                            "text": json.dumps({
                                "total": len(items),
                                "done": done,
                                "remaining": len(items) - done,
                                "items": items,
                            }, indent=2)
                        }]
                    }
                })

            elif tool_name == "check_item":
                result = update_checklist(args["path"], args["item_text"], True)
                return json.dumps({
                    "jsonrpc": "2.0", "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(result)}]
                    }
                })

            elif tool_name == "uncheck_item":
                result = update_checklist(args["path"], args["item_text"], False)
                return json.dumps({
                    "jsonrpc": "2.0", "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(result)}]
                    }
                })

        except Exception as e:
            return json.dumps({
                "jsonrpc": "2.0", "id": req_id,
                "error": {"code": -1, "message": str(e)}
            })

    return json.dumps({
        "jsonrpc": "2.0", "id": req_id,
        "error": {"code": -32601, "message": f"Method not found: {method}"}
    })

def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        response = handle_request(line)
        sys.stdout.write(response + "\n")
        sys.stdout.flush()

if __name__ == "__main__":
    main()
