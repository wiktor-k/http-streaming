#!/usr/bin/env node

import * as https from 'https';
import { StringDecoder } from 'string_decoder';
import { parse } from 'url';

if (process.argv.length < 3) {
    console.error('Error: Missing URL to monitor!');
    process.exit(1);
}

const url = process.argv[2];//'https://metacode.biz/collector/.log';

const parsed = parse(url);

// Empty ranged responses are not allowed, always ask for last byte
// See: https://trac.nginx.org/nginx/ticket/1031#comment:2
function request(from: string, stripByte: boolean) {
    https.get({
        host: parsed.host,
        port: parsed.port,
        path: parsed.path,
        method: 'GET',
        headers: {
            'Range': 'bytes=' + from + '-'
        }
    }, response => {
        const decoder = new StringDecoder('utf8');
        response.on('data', d => {
            let content = decoder.write(d as Buffer);
            if (stripByte) {
                stripByte = false;
                content = content.substring(1);
            }
            process.stdout.write(content);
        });
        response.on('end', function() {
            let range = response.headers['content-range'];
            if (range) {
                if (Array.isArray(range)) {
                    range = range[0];
                }
                const upper = range.split(/[\/-]/g)[1];
                if (upper) {
                    setTimeout(() => request(upper, true), 2000);
                }
            }
        });
    });
}

request('0', false);
