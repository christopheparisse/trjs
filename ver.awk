/version/ { printf "%s%s%s", "s/__version__/", substr($2,2,length($2)-3), "/g" }
