# Paléa Skin Scan

CREATE A WEBSITE FOR MY BRAND "Paléa Labs"  WHERE I CAN SCAN MY FACE AND GET TO KNOW ABOUT MY SKIN TEXTURE AND MY SKIN UNDERTONE WITH UTMOST ACCURACY

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://paleaskin-scan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ae10c5a7-b173-4297-b729-1ed26bd67e11).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Payments (Razorpay)

Standard Web Checkout. Orders are created and verified server-side by Vercel functions in `api/`.

- `POST /api/create-order` — body `{ "product": "full_report" }`; prices are defined in `api/_lib/products.ts`.
- `POST /api/verify-payment` — verifies the Razorpay HMAC-SHA256 signature.

Setup: copy `.env.example` to `.env.local` and fill in the keys. Run `npx vercel dev` (not plain `npm run dev`) so `/api` is served locally. In production, set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `VITE_RAZORPAY_KEY_ID` in the Vercel project's environment variables.
