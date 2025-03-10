#!/usr/bin/env bash

set -e

# --- Verificar si Deno ya está instalado ---
if command -v deno &> /dev/null; then
    echo "Deno ya está instalado: $(deno --version | head -n 1)"
    exit 0
fi

# --- Configuración portable ---
if [[ -z $DENO_VERSION ]]; then
    DENO_VERSION="2.2.2"
fi
if [[-z $INSTALL_DIR ]]; then
    INSTALL_DIR="$HOME/UserApps/deno"
fi
INSTALL_DIR="$INSTALL_DIR/$DENO_VERSION/"
DENO_ZIP="deno-x86_64-pc-windows-msvc.zip"
DENO_URL="https://github.com/denoland/deno/releases/download/v$DENO_VERSION/$DENO_ZIP"

# --- Instalación ---
echo "⬇️ Descargando Deno v$DENO_VERSION..."
curl -L --progress-bar "$DENO_URL" -o "$DENO_ZIP"

echo "📦 Instalando en $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
unzip -q "$DENO_ZIP" -d "$INSTALL_DIR"

echo "🛠️ Configurando PATH..."
if [[ ! -f "$HOME/.bashrc" ]]; then
    {
        echo "#!/usr/bin/env bash"
        echo ""
     } > ~/.bashrc
fi
echo "export PATH=\"$INSTALL_DIR:\$HOME/.deno/bin:\$PATH\"" >> ~/.bashrc

echo "🧹 Limpiando archivos temporales..."
rm "$DENO_ZIP"

# --- Post-instalación ---
source ~/.bashrc

echo ""
echo "✅ Deno instalado correctamente!"
echo "   Ejecuta 'source ~/.bashrc' o reinicia Git Bash"
echo "   Verifica con: deno --version"
echo "   Directorio de instalación: $INSTALL_DIR"
