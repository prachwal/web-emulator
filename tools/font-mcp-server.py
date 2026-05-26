#!/usr/bin/env python3
"""MCP server for font dump tool."""

import sys, os, json
from fontdump import dump_font

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
                "serverInfo": {"name": "font-dump", "version": "0.1.0"},
            }
        })

    elif method == "tools/list":
        return json.dumps({
            "jsonrpc": "2.0", "id": req_id,
            "result": {
                "tools": [
                    {
                        "name": "dump_font",
                        "description": "Dump font .bin file: show glyph pixels, hex, and bit order",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "path": {"type": "string", "description": "Path to .bin font file"},
                                "glyph_size": {"type": "integer", "description": "Bytes per glyph", "default": 8},
                                "glyph_count": {"type": "integer", "description": "Number of glyphs", "default": 256},
                                "offset": {"type": "integer", "description": "File offset", "default": 0},
                                "left_bit": {"type": "integer", "description": "Leftmost bit position (7=MSB, 0=LSB)", "default": 7},
                                "width": {"type": "integer", "description": "Glyph width in pixels", "default": 8},
                                "codes": {"type": "string", "description": "Comma-separated glyph codes to show", "default": ""},
                            },
                            "required": ["path"]
                        }
                    }
                ]
            }
        })

    elif method == "tools/call":
        tool_name = params.get("name", "")
        args = params.get("arguments", {})
        if tool_name == "dump_font":
            codes_str = args.pop("codes", "")
            result = dump_font(**args)
            if codes_str:
                codes = [int(c.strip()) for c in codes_str.split(",") if c.strip()]
                result = [r for r in result if r['code'] in codes] if result else []
            text = []
            if result:
                for g in result:
                    text.append(f"Glyph {g['code']:3d}  [{g['hex']}]")
                    for r in g['rows']:
                        text.append(f"       {r}")
            else:
                text.append("(empty or no matching glyphs)")
            return json.dumps({
                "jsonrpc": "2.0", "id": req_id,
                "result": {"content": [{"type": "text", "text": "\n".join(text)}]}
            })

    return json.dumps({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"Method not found: {method}"}})

def main():
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        response = handle_request(line.strip())
        sys.stdout.write(response + "\n")
        sys.stdout.flush()

if __name__ == '__main__':
    main()
