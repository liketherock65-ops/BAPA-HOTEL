# Bapa Hotel website

A static, single-page website for Bapa Hotel (Bobi Trading Centre, Patoo Village, Omoro District, Uganda).
It needs no build step, no database, no API key and no paid service. It runs on GitHub Pages.

This file is for you and the hotel. It is not part of the visible website.

## What is in the folder

```
bapa-hotel/
├── index.html                    the page (all sections)
├── style.css                     the design
├── script.js                     menu, gallery, enquiry form, and the CONFIG block
├── README.md                     this guide
├── bapa-hotel-*.jpg              photographs
├── bapa-hotel-logo-mark.png      logo mark
└── favicon.png                   browser tab icon
```

There are no subfolders on purpose. Every file sits in the same place, so nothing can end up in the wrong folder when uploading to GitHub.

## Open it on your computer

1. Extract the zip first (right-click, Extract All). Do not open files from inside the zip.
2. Open the extracted `bapa-hotel` folder and double-click `index.html`.

If the page looks plain and unstyled, `style.css` is not next to `index.html`. Make sure you extracted the whole zip.

## Change the phone number, WhatsApp, map and social link (one place)

Open `script.js`. The first block is `CONFIG`:

```js
var CONFIG = {
  hotelName: "Bapa Hotel",
  phone: "+256 782 264973",
  mapsQuery: "Bapa Hotel Bobi Trading Centre Patoo Village Omoro District Uganda",
  social: { tiktok: "https://www.tiktok.com/@bapahotelgulu" },
  maxGuests: 20,
  generalWhatsAppText: "Hello Bapa Hotel, I would like to enquire about accommodation."
};
```

- `phone` drives every call link, every WhatsApp link, the enquiry message and the numbers shown on the page. The WhatsApp link is built by removing the plus sign and spaces.
- `mapsQuery` drives Get Directions and the map. It is a search, not exact coordinates. When the hotel confirms its exact Google Maps location, replace the query with it.
- `social.tiktok` is the TikTok link. Set it to `""` and the link disappears from the footer. Add Instagram or Facebook later by adding entries to `social` and a matching `<li data-social="instagram">` in the footer of `index.html`.

The phone number also appears in two places that JavaScript does not change: the structured data near the top of `index.html` (search for `+256782264973`) and the fallback text for visitors with JavaScript turned off. If the number changes, use Find and Replace in a text editor to update those too.

## Replace the photographs

Replace a photo file with a new photo that has the exact same filename. No code changes are needed.

| File | Where it appears | Type | Best shape |
|---|---|---|---|
| `bapa-hotel-pool.jpg` | Hero (large), gallery | Hero | Wide, 16:9 |
| `bapa-hotel-building.jpg` | Hero (small), gallery | Hero | 4:3 |
| `bapa-hotel-room-01.jpg` | Hero (small), Accommodation, gallery | Room | 3:2 |
| `bapa-hotel-room-02.jpg` | Accommodation, gallery | Room | Portrait, 2:3 |
| `bapa-hotel-exterior.jpg` | About, gallery | Exterior | 3:2 |
| `bapa-hotel-pool-evening.jpg` | Facilities (swimming pool), gallery | Facility | 4:3 |
| `bapa-hotel-pool-wide.jpg` | Gallery | Gallery | 16:9 |
| `bapa-hotel-grounds.jpg` | Gallery | Gallery | 4:3 |
| `bapa-hotel-logo-mark.png` | Header and footer | Logo | Square-ish, transparent background |
| `favicon.png` | Browser tab icon | Icon | Square, 192 x 192 |

The photos supplied so far are small web-sized images (some under 300 pixels wide), so they look soft on large screens. Ask the hotel for the original photos from their phone or camera and replace the files. Aim for about 1600 pixels wide and under 300 KB each (save as JPEG).

Photos still needed: the bar and the dining area. In the Facilities section those two show "Photograph coming soon". To add one, open `index.html`, find the facility, and replace the `<div class="ph-media" ...>` block with the `<div class="media"><img ...></div>` example in the comment above the facilities grid. Do the same for room photos.

To add or remove gallery photos, copy or delete one `<a class="g-item" ...>` block in the Gallery section.

If a photo file is missing, the layout stays intact and that spot shows a calm panel instead of a broken image icon.

## Edit text

All text is plain HTML in `index.html`. Search for the heading you want (for example "Accommodation") and edit the words. To add rooms, FAQs or facilities, copy an existing block. The comments in the file say where.

## How the enquiry form works

The website has no server, so the form cannot reserve a room, store anything or send an email.

1. The visitor fills in the form. It checks required fields, phone and email format, that check-in is not in the past, that check-out is after check-in, and a sensible number of guests.
2. A review screen shows the message and an Open WhatsApp button. WhatsApp opens with the message ready, and the visitor sends it themselves.
3. If WhatsApp does not open, the visitor can copy the message or call the hotel.

Nothing is saved in the browser. The page never says a stay is confirmed. Online payment is not offered, and no card or bank details are requested.

## Publish on GitHub Pages

1. Sign in to github.com and create a new repository (or open your existing one).
2. Extract the zip on your computer.
3. In the repository, choose Add file, then Upload files.
4. Open the extracted `bapa-hotel` folder, press Ctrl+A to select every file, and drag them all in at once. There are no folders to worry about. `index.html` must sit at the top level of the repository, not inside another folder.
5. Choose Commit changes.
6. Go to Settings, then Pages. Under Build and deployment, set Source to "Deploy from a branch", Branch to `main`, Folder to `/ (root)`, then Save.
7. Wait one to two minutes and refresh the Pages screen. The address of your site appears at the top, for example `https://your-username.github.io/your-repository/`.

All links in the project are relative, so the site works in a repository subfolder address as well as on a custom domain.

If you use GitHub Desktop instead, copy the files into your repository folder, then Commit and Push.

### If something is missing after publishing

- Plain page with no design: `style.css` is not at the top level next to `index.html`. Open the repository and check.
- No pictures (you see "Photograph coming soon" panels): the `.jpg` and `.png` files are missing from the repository or are not next to `index.html`. Upload them again.
- Menu or form does nothing: `script.js` is missing or not next to `index.html`.
- Old version still showing: hold Ctrl and press F5 (or clear the browser cache), and wait a minute for GitHub to rebuild.

## Information the hotel must confirm before launch

The website avoids stating anything that has not been confirmed. Please check these with Bapa Hotel management:

- The public phone number +256 782 264973 and whether it is also the WhatsApp number.
- Whether the hotel is about 500 metres from the Gulu to Kampala Highway.
- The hotel's exact location on Google Maps (the map is only a search for the address).
- Whether the TikTok account @bapahotelgulu belongs to the hotel. The link given was cut off, so the video link was not used.
- Whether the two room photos are Bapa Hotel's own rooms.
- Number of rooms, room types, bed arrangements, in-room facilities and rates.
- Whether the swimming pool, bar and food service are currently available, with opening times.
- Check-in and check-out times, accepted payment methods, deposit and cancellation rules.
- An official email address and any social media accounts, if the hotel wants them shown.
- Whether the hotel is happy to be shown using its name and photos on this website.

## What was and was not tested

Tested in a headless Chromium browser at 320, 375, 768, 1024 and 1440 pixels wide: no sideways scrolling at any width, mobile menu (open, close, Escape, link click), form validation and the generated WhatsApp message, the gallery lightbox (open, next, previous, Escape), the FAQ, pre-filled buttons, all in-page links, and the page with JavaScript switched off.

Not tested: a real phone, WhatsApp actually opening, Google Maps loading, and screen readers. The test machine had no internet, so the Google font (Fraunces and Source Sans 3) did not load and the fallback fonts were used. Please open the site on the hotel's own phone, with internet, before launch.

## Limits

This is a static website. It cannot check availability, take payments or store enquiries. If the hotel later wants those, a booking system or a small backend would be needed.
