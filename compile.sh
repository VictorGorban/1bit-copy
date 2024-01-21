#!/bin/bash
# скомпилить алгоритмы в проде пока что достаточно - алгоритм пусть смотрят, там ничего гениального нет.

modules_bin=./node_modules/.bin

# for file in ./build/server/chunks/*
# do
#     if [ -f "$file" ]; then
#         filename=$(basename -- "$file")
#         extension="${filename##*.}"
#         if [[ "$extension" == "js" ]]; then
#             # echo 'js file' $file $extension
#             "$modules_bin"/javascript-obfuscator $file --output $file --target node --options-preset low-obfuscation;
#             "$modules_bin"/bytenode -c $file -l $filename;
#         fi
#     fi
# done

# "$modules_bin"/javascript-obfuscator helpers/license/index.js --output helpers/license/index.js --target node --options-preset low-obfuscation;
# echo "running bytenode...";
# "$modules_bin"/bytenode -c helpers/license/index.js -l helpers/license/index.js;

# "$modules_bin"/javascript-obfuscator helpers/license/helpers.js --output helpers/license/helpers.js --target node --options-preset low-obfuscation;
# echo "running bytenode...";
# "$modules_bin"/bytenode -c helpers/license/helpers.js -l helpers/license/helpers.js;