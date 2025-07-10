const crypto = require('crypto');

function decode(str) {
  const map = { '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
                'a':10,'b':11,'c':12,'d':13,'e':14,'f':15 };
  const arr = [];
  for (let i = 0; i < 32; i += 2) {
    const hi = map[str[i]];
    const lo = map[str[i+1]];
    arr.push((hi << 4) | lo);
  }
  return arr;
}

function md5Array(arr) {
  const buf = Buffer.from(arr);
  return crypto.createHash('md5').update(buf).digest('hex');
}

function md5String(s) {
  return crypto.createHash('md5').update(s, 'utf8').digest('hex');
}

function encodeWithKey(key, data) {
  const result = new Array(256);
  let temp = 0;
  let output = '';
  for (let i = 0; i < 256; i++) result[i] = i;
  for (let i = 0; i < 256; i++) {
    temp = (temp + result[i] + key[i % key.length]) & 0xFF;
    [result[i], result[temp]] = [result[temp], result[i]];
  }
  let t1 = 0, t2 = 0;
  for (let i = 0; i < data.length; i++) {
    t1 = (t1 + 1) & 0xFF;
    t2 = (t2 + result[t1]) & 0xFF;
    [result[t1], result[t2]] = [result[t2], result[t1]];
    const idx = (result[t1] + result[t2]) & 0xFF;
    output += String.fromCharCode(data.charCodeAt(i) ^ result[idx]);
  }
  return output;
}

function b64encode(str, table="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=") {
  let out = '';
  for (let i = 0; i < str.length; i += 3) {
    const c1 = str.charCodeAt(i);
    const c2 = str.charCodeAt(i+1);
    const c3 = str.charCodeAt(i+2);
    const enc1 = c1 >> 2;
    const enc2 = ((c1 & 3) << 4) | (c2 !== undefined ? (c2 >> 4) : 0);
    const enc3 = c2 !== undefined ? (((c2 & 15) << 2) | (c3 !== undefined ? (c3 >> 6) : 0)) : 64;
    const enc4 = c3 !== undefined ? (c3 & 63) : 64;
    out += table[enc1] + table[enc2] + table[enc3] + table[enc4];
  }
  return out;
}

function cal_num_list(_num_list) {
  const order = [3,5,7,9,11,13,15,17,19,21,4,6,8,10,12,14,16,18,20];
  return order.map(idx => _num_list[idx-1]);
}

function _0x22a2b6(...args) {
  const a = new Array(19).fill(0);
  // assign each appropriate index based on the Python mapping
  a[0] = args[0]; // 위치 인덱스는 그대로 간주
  a[1] = args[10];
  a[2] = args[1];
  a[3] = args[11];
  a[4] = args[2];
  a[5] = args[5];
  a[6] = args[3];
  a[7] = args[13];
  a[8] = args[4];
  a[9] = args[8];
  a[10] = args[6];
  a[11] = args[9];
  a[12] = args[12];
  a[13] = args[14];
  a[14] = args[15];
  a[15] = args[16];
  a[16] = args[17];
  a[17] = args[7];
  a[18] = args[10]; // careful: you may adjust mapping if needed
  return String.fromCharCode(...a);
}

function _0x263a8b(s) {
  return '\x02' + 'ÿ' + s;
}

function get_x_bogus(params, data, user_agent) {
  const s0 = md5String(data);
  const s1 = md5String(params);
  const s0_1 = md5Array(decode(s0));
  const s1_1 = md5Array(decode(s1));
  const d = encodeWithKey([0,1,12], user_agent);
  const ua_str = b64encode(d);
  const ua_str_md5 = md5String(ua_str);
  const timestamp = Math.floor(Date.now() / 1000);
  const canvas = 536919696;
  const salt_list = [
    timestamp, canvas,64,0,1,12,
    decode(s1_1).slice(-2)[0], decode(s1_1).slice(-2)[1],
    decode(s0_1).slice(-2)[0], decode(s0_1).slice(-2)[1],
    decode(ua_str_md5).slice(-2)[0], decode(ua_str_md5).slice(-2)[1]
  ];
  [24,16,8,0].forEach(shift => salt_list.push((salt_list[0] >> shift) & 0xFF));
  [24,16,8,0].forEach(shift => salt_list.push((salt_list[1] >> shift) & 0xFF));
  let tem = 64;
  salt_list.slice(3).forEach(x => tem ^= x);
  salt_list.push(tem, 255);
  const num_list = cal_num_list(salt_list);
  const short2 = encodeWithKey([255], _0x22a2b6(...num_list));
  const short3 = _0x263a8b(short2);
  const x_b = b64encode(short3, "Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe");
  return x_b;
}

// Example usage:
console.log(get_x_bogus(
  "msToken=",
  '{"keyword_list":["口红"],"start_date":"20220529","end_date":"20220629","app_name":"aweme"}',
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
));
