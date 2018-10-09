sed -e $(awk -f ver.awk package.json) majpgmct3.shmodel > majpgmct3.sh
sed -e $(awk -f ver.awk package.json) majpgmwin.shmodel > majpgmwin.sh
sed -e $(awk -f ver.awk package.json) transcriberjs-x64.nsimodel > transcriberjs-x64.nsi
sed -e $(awk -f ver.awk package.json) transcriberjs-x86.nsimodel > transcriberjs-x86.nsi
sed -e $(awk -f ver.awk package.json) maj.shmodel > maj.sh
sed -e $(awk -f ver.awk package.json) maj.batmodel > maj.bat
