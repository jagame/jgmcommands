#!/usr/bin/env bash

set -e

# --- Verificar si Deno ya está instalado ---
if command -v deno &> /dev/null; then
    echo "Deno is currently installed: $(deno --version | head -n 1)"
    exit 0
fi

# --- Configuración portable ---
if [[ -z $DENO_VERSION ]]; then
    DENO_VERSION="2.2.2"
fi
if [[ -z $INSTALL_DIR ]]; then
    INSTALL_DIR="$HOME/UserApps/deno"
fi
INSTALL_DIR="$INSTALL_DIR/$DENO_VERSION/"
ZIP_NAME="deno-x86_64-pc-windows-msvc.zip"
URL="https://github.com/denoland/deno/releases/download/v$DENO_VERSION/$ZIP_NAME"

# --- Instalación ---
echo "⬇️ Downloading Deno v$DENO_VERSION..."
curl -L --progress-bar "$URL" -o "$ZIP_NAME"

echo "📦 Installing at $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
unzip -q "$ZIP_NAME" -d "$INSTALL_DIR"

if [[ ! -f "$HOME/.bashrc" ]]; then
    {
        echo "#!/usr/bin/env bash"
     } > ~/.bashrc
fi
echo "Adding to bash PATH..."
{
    echo ""
    echo "# Deno path"
    echo "export PATH=\"$INSTALL_DIR:\$HOME/.deno/bin:\$PATH\""
    echo "export DENO_TLS_CA_STORE=system"
} >> "$HOME/.bashrc"

echo "🧹 Cleaning temporal files..."
rm "$ZIP_NAME"

echo ""
echo "✅ Deno was successfully installed!"
echo "   Execute \`source ~/.bashrc\` or restart the bash terminal."
echo "   Check the installation executing: deno --version"
echo "   Installation folder: $INSTALL_DIR"
