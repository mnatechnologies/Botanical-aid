#!/bin/bash
# Run from project root: bash download-assets.sh

OUT="public/circle/assets"
mkdir -p "$OUT"

download() {
  local dest="$1" url="$2"
  printf "  %-38s" "$dest"
  HTTP=$(curl -sL -w "%{http_code}" -o "${OUT}/${dest}" --max-time 120 \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" "$url")
  SIZE=$(wc -c < "${OUT}/${dest}" 2>/dev/null | tr -d ' ')
  if [ "$HTTP" = "200" ] && [ "$SIZE" -gt 500 ]; then
    echo "✓  ${SIZE} bytes"
  else
    echo "✗  HTTP $HTTP"
    rm -f "${OUT}/${dest}"
  fi
}

echo "Downloading assets to $OUT/ ..."
echo ""

download "banner04.webp"               "https://botanicalaid.com.au/wp-content/uploads/2025/10/banner04.png-2-2.webp"
download "banner02.webp"               "https://botanicalaid.com.au/wp-content/uploads/2025/10/Generated_Image_November_142C_2025_-_6_34AM-2.webp"
download "hero-video.mp4"              "https://botanicalaid.com.au/wp-content/uploads/2025/11/WhatsApp_Video_2025-11-21_at_10.23.55.mp4"
download "focus-clarity.jpg"           "https://botanicalaid.com.au/wp-content/uploads/2025/07/afcc2.jpg"
download "grief.jpg"                   "https://botanicalaid.com.au/wp-content/uploads/2025/07/gac2.jpg"
download "mild-anxiety.jpg"            "https://botanicalaid.com.au/wp-content/uploads/2025/07/mac2.jpg"
download "mild-depression.jpg"         "https://botanicalaid.com.au/wp-content/uploads/2025/07/mdac2.jpg"
download "post-surgery-care.jpg"       "https://botanicalaid.com.au/wp-content/uploads/2025/07/post_surgery_mockup_large_bottle_1.jpg"
download "post-cosmetic-cream.jpg"     "https://botanicalaid.com.au/wp-content/uploads/2025/07/Post_Cosmetic_Cream_Mockup-300x300.jpg"
download "post-lip-balm.jpg"           "https://botanicalaid.com.au/wp-content/uploads/2025/07/Post_Cosmetic_Lip_Balm_Mockup-300x300.jpg"
download "logo-white.png"              "https://botanicalaid.com.au/wp-content/uploads/2025/06/01-1.png"
download "hero-shop.png"               "https://botanicalaid.com.au/wp-content/uploads/2025/06/iStock-1284076556-Steven-Granville.png"
download "hero-testimonials.jpg"       "https://botanicalaid.com.au/wp-content/uploads/2025/06/iStock-1318440921-Surasak-Suwanmake.jpg"
download "category-post-treatment.png" "https://botanicalaid.com.au/wp-content/uploads/2025/06/iStock-1320983269-Tirachard-Lighter.png"
download "hero-contact.jpg"            "https://botanicalaid.com.au/wp-content/uploads/2025/06/iStock-1437842817-Wirestock-scaled.jpg"
download "category-mental-health.png"  "https://botanicalaid.com.au/wp-content/uploads/2025/06/iStock-2181645924-BongkarnThanyakij.png"
download "hero-about.jpg"              "https://botanicalaid.com.au/wp-content/uploads/2025/10/8441e90f182ccc825cebd6253b9dd5ff.jpg"
download "why-choose-us.jpg"           "https://botanicalaid.com.au/wp-content/uploads/2025/10/iStock-487443470-MoustacheGirl.jpg"

download "hero-mental-health.webp"      "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/12/1576-1.webp"
download "hero-post-treatment.avif"    "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/12/young-woman-applying-cosmetic-white-cream-her-face-mirror_183314-4864-1.avif"

# Category sub-circle images (Mental Health)
download "circle-focus-clarity.png"    "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/iStock-1320983269-Tirachard-Lighter-1.png"
download "circle-grief.png"            "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/iStock-1320983269-Tirachard-Lighter-2.png"
download "circle-mild-anxiety.png"     "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/iStock-1320983269-Tirachard-Lighter-3.png"
download "circle-mild-depression.png"  "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/iStock-1320983269-Tirachard-Lighter-4.png"

# Category sub-circle images (Post Treatment)
download "circle-post-cosmetic.png"    "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/iStock-1320983269-Tirachard-Lighter-5.png"
download "circle-post-lip-filler.png"  "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/12/Group-1272628126.png"
download "circle-post-surgery.png"     "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/iStock-1320983269-Tirachard-Lighter-7.png"

# About page images
download "about-extra.png"             "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/about_extra_image.png"
download "about-victoria.png"          "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/homo_owner.png"
download "about-homeopathy-banner.jpg" "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/iStock-1350786749-Sergey-Kirsanov.jpg"

# FAQ header logos
download "faq-botanicalaid.png"      "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/image-8.png"
download "faq-homeopathy.png"        "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/image-9-2.png"

echo ""
echo "Done. Files in $OUT/:"
ls -lh "$OUT/"
