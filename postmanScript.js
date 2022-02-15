function createSignture(http_method, url_path, body, secret_key, access_key, salt, timestamp) {
  body = JSON.stringify(body);
  const to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + body;
  let hash = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
  hash = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(hash));
  return hash;
}

let reqData = {};
if(pm.request.body.raw){
  reqData=JSON.parse(pm.request.body.raw);
}

const timestamp = Date.now().toString();
const http_method = pm.request.method;
const path = request.url.split(8080)[1];
const salt = JSON.stringify(CryptoJS.lib.WordArray.random(12));
const secret_key = "secret";
const access_key = "access";
const signature = createSignture( http_method, path, reqData, secret_key, access_key, salt, timestamp);

pm.request.headers.add({
  key: "x-signature",
  value: signature
});
pm.request.headers.add({
  key: "x-access-key",
  value: access_key
});
pm.request.headers.add({
  key: "x-secret-key",
  value: access_key
});
pm.request.headers.add({
  key: "x-salt",
  value: salt
});
pm.request.headers.add({
  key: "x-timestamp",
  value: timestamp
});