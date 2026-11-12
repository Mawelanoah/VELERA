# VELÉRA — upgraded boutique storefront

A mobile-first static fashion storefront designed for GitHub Pages. It now includes a searchable/filterable catalogue, product detail and size selection, wishlist, persistent shopping bag, quantity controls, WhatsApp order requests, optional Yoco payment-link handoff, size-guide section, delivery/returns information, FAQs, SEO metadata and a store-policy template.

## Files
- `index.html` — homepage, catalogue, size guide, delivery information and FAQ
- `style.css` — responsive boutique styling
- `products.js` — catalogue and store configuration
- `script.js` — catalogue search/sort/filter, wishlist, bag, quantity and checkout behaviour
- `policies.html` — editable privacy, delivery, returns and order-policy template
- `assets/velera-logo.svg` — brand wordmark

## Required setup before taking orders
1. In `products.js`, replace all sample dresses with products you have permission to sell and can actually fulfil.
2. Add your own authorised product photographs under `assets/`; update each product's `image` path. Do not use supplier or model photographs unless you have permission to use them commercially.
3. Enter accurate product names, descriptions, fabric details, sizes, garment measurements, stock status and selling prices. Remove any size that is unavailable.
4. Replace `ADD_YOUR_WHATSAPP_NUMBER` with your business number in international format without `+`, spaces or dashes, e.g. `27821234567`.
5. Add your Instagram profile URL.
6. Add a Yoco payment link only if you have created and tested the correct payment link. This button opens that link; it does not automatically calculate or charge the cart total. Confirm the order and exact amount with the customer first.
7. Complete the measurement chart in `index.html` using actual garment measurements.
8. Edit `policies.html` and the delivery/returns text in `index.html` with your real courier, fees, timelines, contact details and compliant policies. Remove all placeholders.
9. Test the site on a phone and desktop, including product selection, bag persistence, quantity changes and WhatsApp order message.

## Important technical limits
This is a static GitHub Pages site. It does not include customer accounts, a private admin dashboard, live stock synchronisation, automated supplier fulfilment, order database, automatic shipping quotes or a true integrated checkout. Cart and wishlist data are saved only in the customer's browser. WhatsApp is used to submit an order request; the Yoco button is an optional external payment-link handoff. Do not claim an order is confirmed until you have checked stock and confirmed it with the customer.

## Publish with GitHub Pages
1. Create/open your public GitHub repository (for example, `velera`).
2. Upload the contents of the `velera_store` folder to the repository root, including the `assets` folder and `policies.html`.
3. Open **Settings → Pages**.
4. Under Build and deployment, select **Deploy from a branch → main → /(root) → Save**.
5. Wait for GitHub Pages to publish, then test the live URL.
