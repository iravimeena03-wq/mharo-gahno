# MHARO GAHNO Admin Panel — pehli baar setup

Admin Panel link: `https://iravimeena03-wq.github.io/mharo-gahno/admin.html`

Ek baar database connect hone ke baad products, photos, prices aur descriptions panel se badlenge. Panel mobile aur computer dono par chal sakta hai.

## 1. Supabase project banao

1. [Supabase](https://supabase.com/) par apne account se login karke **New project** banao.
2. Project ready ho jaaye to **Project Settings → API** kholo.
3. **Project URL** aur **Publishable key** copy karo. Purane dashboard mein yahi key `anon` ke naam se ho sakti hai.
4. `service_role` ya `secret` key kabhi Admin Panel, website ya kisi ko share mat karna.

## 2. Products/photos table taiyaar karo

1. Supabase mein **SQL Editor → New query** kholo.
2. Is GitHub repository ki `supabase-schema.sql` file kholo, poora SQL copy karke SQL Editor mein paste karo aur **Run** dabao.
3. **Authentication → Providers → Email** mein naye users ke sign-up ko band karo.
4. **Authentication → Users → Add user** mein apna email/password wala ek admin account banao. Sirf apne bharosemand admin ko hi account dena.

## 3. Admin Panel connect karo

1. `admin.html` kholo.
2. Project URL aur Publishable/anon key bhar kar **Save connection here** dabao.
3. Apne admin email/password se login karo.
4. **Import current 7 products** dabao. Isse abhi website par maujood products panel mein aa jayenge.

## 4. Public website ko ek baar connect karo

1. Admin panel ke upar **Download website settings** dabao; `site-config.js` file download hogi.
2. GitHub repository `mharo-gahno` kholo → **Add file → Upload files**.
3. Download ki hui `site-config.js` file upload karo. File ko root mein rakhkar commit karo. (Agar GitHub duplicate file ka message de, existing `site-config.js` kholo, pencil se edit karo aur downloaded file ka text paste karke commit karo.)
4. Thodi der baad website reload karo. Ab database ke active products site par dikhne chahiye.

Iske baad daily product changes ke liye bas Admin Panel par login kar. Product photo ke liye maximum 4 JPG/PNG/WebP images select kar sakta hai. **Remove** product ko site se hide karta hai; record recoverable rehta hai.

## Security yaad rakhna

- Website mein sirf publishable/anon key honi chahiye; service-role key nahi.
- SQL mein public visitors ko active products dekhne aur sirf authenticated users ko badlav karne ki permission hai. Supabase mein public sign-ups off rakho.
- Password kisi ko chat mein mat bhejna. Browser is device par login session rakh sakta hai; shared computer ho to Admin Panel se logout karna.
- Ye products/photos ka admin backend hai. COD WhatsApp enquiry bhejta hai; online payment aur QR tab tak active nahi honge jab tak payment provider ka alag setup/KYC poora na ho.
