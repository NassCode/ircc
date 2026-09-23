# Local nginx proxy

This setup serves the Vite development app at `https://canada.ca`, on this
computer only, with HTTP redirecting to HTTPS. It does not modify public DNS.
The certificate is trusted locally, not publicly. While the hosts
override is active, this computer cannot reach the real apex `canada.ca` site.
Subdomains such as `www.canada.ca` are not overridden.

From the repository root:

```bash
sudo apt update
sudo apt install nginx mkcert libnss3-tools
mkcert -install
mkdir -p dev/nginx/certs
mkcert -cert-file dev/nginx/certs/canada.ca.pem -key-file dev/nginx/certs/canada.ca-key.pem canada.ca
sudo install -d -m 700 /etc/nginx/ircc-local-certs
sudo install -m 644 dev/nginx/certs/canada.ca.pem /etc/nginx/ircc-local-certs/canada.ca.pem
sudo install -m 600 dev/nginx/certs/canada.ca-key.pem /etc/nginx/ircc-local-certs/canada.ca-key.pem
sudo install -m 644 dev/nginx/canada.ca.conf /etc/nginx/sites-available/ircc-local
```

Run `mkcert` as your normal user; it requests sudo when needed to install its
local certificate authority. Never share its `rootCA-key.pem`. Generated site
certificates and keys are ignored by Git. Renew them by rerunning the generation
and installation commands before expiry and reloading nginx.

For a first-time setup only (skip the symlink if already enabled):

```bash
sudo ln -s /etc/nginx/sites-available/ircc-local /etc/nginx/sites-enabled/ircc-local
sudoedit /etc/hosts
```

Add this line to `/etc/hosts` and save:

```text
127.0.0.1 canada.ca # ircc-local
```

Check the configuration and start/reload nginx only if the check succeeds:

```bash
sudo nginx -t && sudo systemctl start nginx && sudo systemctl reload nginx
npm run dev
```

In another terminal, verify both the proxy and the hosts mapping:

```bash
curl --noproxy '*' --resolve canada.ca:443:127.0.0.1 -I https://canada.ca
getent hosts canada.ca
```

Fully quit and restart your browser, then open `https://canada.ca`.
A 502 response means Vite is not running on port 5173.
If the browser reports an untrusted certificate, verify `mkcert -install`
succeeded for its trust store; do not bypass certificate errors. Sandboxed
browser installations may require manually importing the public `rootCA.pem`
from the directory printed by `mkcert -CAROOT` into their certificate authorities.
Never import or share `rootCA-key.pem`.
Use a separate browser profile for local testing to isolate existing site data.

To undo the override, remove the marked line using `sudoedit /etc/hosts`, then
disable just this site's symlink and reload nginx:

```bash
sudo unlink /etc/nginx/sites-enabled/ircc-local
sudo nginx -t && sudo systemctl reload nginx
```

The saved configuration remains in sites-available for reuse.
If you no longer use mkcert for any project, `mkcert -uninstall` removes its
installed CA trust; manually imported trust must be removed separately.
