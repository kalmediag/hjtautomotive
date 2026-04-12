#!/bin/zsh

set -euo pipefail

ROOT_DIR="${1:-.}"
SOURCE_DIR="${ROOT_DIR}/photos.nosync"
OUTPUT_DIR="${ROOT_DIR}/assets/optimized"

if [[ ! -d "${SOURCE_DIR}" ]]; then
  echo "Source directory not found: ${SOURCE_DIR}" >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

find "${SOURCE_DIR}" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | while IFS= read -r source_file; do
  relative_path="${source_file#${SOURCE_DIR}/}"
  target_file="${OUTPUT_DIR}/${relative_path%.*}.jpg"
  target_dir="$(dirname "${target_file}")"

  mkdir -p "${target_dir}"

  if [[ -f "${target_file}" && "${target_file}" -nt "${source_file}" ]]; then
    continue
  fi

  tmp_file="${target_file}.tmp.jpg"
  rm -f "${tmp_file}"

  sips \
    --resampleHeightWidthMax 1800 \
    --setProperty format jpeg \
    --setProperty formatOptions 72 \
    "${source_file}" \
    --out "${tmp_file}" >/dev/null

  mv "${tmp_file}" "${target_file}"
done

# Mirror videos into optimized assets without re-encoding.
# This keeps project video paths stable and avoids expensive transcodes in this script.
find "${SOURCE_DIR}" -type f \( -iname '*.mp4' -o -iname '*.webm' -o -iname '*.mov' \) | while IFS= read -r source_file; do
  relative_path="${source_file#${SOURCE_DIR}/}"
  target_file="${OUTPUT_DIR}/${relative_path}"
  target_dir="$(dirname "${target_file}")"

  mkdir -p "${target_dir}"

  if [[ -f "${target_file}" && "${target_file}" -nt "${source_file}" ]]; then
    continue
  fi

  cp -f "${source_file}" "${target_file}"
done

echo "Optimized images written to ${OUTPUT_DIR}"
