#!/usr/bin/env bash
# Download ingredient images from the demo site
# Run: bash download-ingredient-images.sh

DEST="public/assets/ingredients"
mkdir -p "$DEST"

download() {
  local name="$1" url="$2"
  if [ -f "$DEST/$name" ]; then
    echo "SKIP  $name (exists)"
  else
    echo "GET   $name"
    curl -fsSL -o "$DEST/$name" "$url" && echo "  OK" || echo "  FAIL"
  fi
}

# Focus & Clarity ingredients
download "lycopodium.jpg"        "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/pr.jpg"
download "lavender.jpg"          "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/LAV.jpg"
download "sage-oil.jpg"          "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/so.jpg"
download "lemon-floral.jpg"      "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/lmo.jpg"
download "orange-floral.png"     "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/Picture121.png"

# Grief ingredients
download "ignatia-amara.png"     "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/Picturqwe1.png"
download "ylang-ylang.jpg"       "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/yy.jpg"
download "rose-oil.png"          "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/06/Pictaare1.png"

# Mild Anxiety ingredients
download "bergamot.jpg"          "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/ber.jpg"
download "clary-sage.jpg"        "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/cs-300x300.jpg"

# Mild Depression ingredients
download "chamomile.jpg"         "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/rc.jpg"
download "ginger-oil.jpg"        "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/GO.jpg"

# Post Surgery Care Cream ingredients
download "calendula.jpg"         "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/CALE.jpg"
download "arnica.jpg"            "https://botancalaid.websitedemolink.xyz/wp-content/uploads/2025/07/AR.jpg"

echo ""
echo "Done! Images saved to $DEST/"
