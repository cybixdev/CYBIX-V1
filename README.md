# DEVINFO

## Example Output

```
██████╗ ███████╗██╗   ██╗██╗███╗   ██╗███████╗ ██████╗ 
██╔══██╗██╔════╝██║   ██║██║████╗  ██║██╔════╝██╔═══██╗
██║  ██║█████╗  ██║   ██║██║██╔██╗ ██║█████╗  ██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║╚██╗██║██╔══╝  ██║   ██║
██████╔╝███████╗ ╚████╔╝ ██║██║ ╚████║███████╗╚██████╔╝
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝ 

================= D E V I N F O =================

--------------------------------------------------------
==[ DEVICE & CORE ]==
[•] Model: SM-G970F
[•] Android ID: 123456789abcdef
[•] OS: Linux-4.19.87-android-x86_64-with-libc
[•] Arch: x86_64
[•] Kernel: Linux device 4.19.87 #1 SMP PREEMPT
[•] Hostname: device
[•] Shell: /data/data/com.termux/files/usr/bin/bash
[•] Timezone: UTC
[•] Uptime: 5h 21m
[•] User Login: termux
[•] User Home: /data/data/com.termux/files/home
[•] Groups: users, wheel
[•] Hidden Files: .bashrc, .profile, .ssh, .config, ...
--------------------------------------------------------
==[ NETWORK ]==
[•] Local IP: 192.168.1.12
[•] External IP: 45.67.89.123
[•] MAC Address: 00:11:22:33:44:55
[•] All IPs:
...
[•] Active Connections:
...
[•] Network Info:
...
[•] WiFi Scan:
...
--------------------------------------------------------
==[ STORAGE & SYSTEM ]==
[•] Storage: Total: 64 GB | Used: 23 GB | Free: 41 GB
[•] Disk Partitions:
...
[•] Filesystem Type:
...
[•] Mounts:
...
[•] Temp Files: file1, file2, file3, ...
--------------------------------------------------------
==[ PACKAGES & SERVICES ]==
[•] Installed Packages (first 15):
curl
nano
python
git
...
[•] Running Services:
...
[•] Process Tree:
...
[•] Loaded Modules:
...
[•] Crontab:
...
[•] Sudoers (first 15 lines):
...
--------------------------------------------------------
==[ BATTERY & HARDWARE ]==
[•] Battery: {"percentage":92,"plugged":false,"status":"DISCHARGING"}
[•] CPU Info:
...
[•] Memory Info:
...
--------------------------------------------------------
==[ ENVIRONMENT & LOGS ]==
[•] Env Variables:
...
[•] Python Version: 3.11.6 (main, Sep  4 2025, 09:32:03) [GCC 10.2.1 20210110]
[•] Lastlog:
...
[•] Recent System Logs:
...
--------------------------------------------------------

D E V I N F O   -   S Y S T E M   R E P O R T   C O M P L E T E

Review complete.
```

---

## Installation

### Termux

```sh
pkg install python
pkg install termux-api
pip install requests
wget https://raw.githubusercontent.com/cypher-x953/devinfo/main/devinfo.py
chmod +x devinfo.py
python devinfo.py
```

### Linux

```sh
sudo apt update
sudo apt install python3 python3-pip curl
pip3 install requests
wget https://raw.githubusercontent.com/cypher-x953/devinfo/main/devinfo.py
chmod +x devinfo.py
python3 devinfo.py
```

### Others

- Requires Python 3 and `requests` library.
- Run with `python3 devinfo.py` after download.

---
