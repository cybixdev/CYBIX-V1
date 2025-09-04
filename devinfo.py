#!/usr/bin/env python3
import os
import platform
import sys
import socket
import uuid
import subprocess
import shutil
import time
import random
import threading
import getpass

# ANSI colors for visual structure
RED = "\033[31m"
GREEN = "\033[32m"
CYAN = "\033[36m"
YELLOW = "\033[33m"
MAGENTA = "\033[35m"
WHITE = "\033[97m"
RESET = "\033[0m"
BOLD = "\033[1m"
UNDER = "\033[4m"
BLINK = "\033[5m"

# Extended Banner Art
BANNER = f"""
{CYAN}{BOLD}
██████╗ ███████╗██╗   ██╗██╗███╗   ██╗███████╗ ██████╗ 
██╔══██╗██╔════╝██║   ██║██║████╗  ██║██╔════╝██╔═══██╗
██║  ██║█████╗  ██║   ██║██║██╔██╗ ██║█████╗  ██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║╚██╗██║██╔══╝  ██║   ██║
██████╔╝███████╗ ╚████╔╝ ██║██║ ╚████║███████╗╚██████╔╝
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝ 
{RESET}
{MAGENTA}{UNDER}================= D E V I N F O ================={RESET}
"""

def loading_effect(msg, duration=1.7):
    chars = ['|','/','-','\\']
    t_end = time.time() + duration
    idx = 0
    while time.time() < t_end:
        print(f"\r{RED}{BOLD}{msg} {chars[idx % len(chars)]}{RESET}", end='')
        idx += 1
        time.sleep(0.11)
    print('\r', end='')

def print_section(title):
    print(f"\n{MAGENTA}{BOLD}{UNDER}==[ {title} ]=={RESET}")

def print_info(label, value, color=YELLOW):
    print(f"{CYAN}{BOLD}[•]{RESET} {color}{label}{RESET} {WHITE}{value}{RESET}")

def separator():
    print(f"{RED}{BOLD}{'-'*56}{RESET}")

def get_external_ip():
    loading_effect("Obtaining external IP")
    try:
        import requests
        ip = requests.get("https://api.ipify.org").text
        return ip
    except Exception:
        try:
            ip = subprocess.check_output("curl -s https://api.ipify.org", shell=True).decode().strip()
            return ip if ip else "Unavailable"
        except Exception:
            return "Unavailable"

def get_local_ip():
    try:
        hostname = socket.gethostname()
        return socket.gethostbyname(hostname)
    except Exception:
        return "Unavailable"

def get_all_ips():
    loading_effect("Listing IP addresses")
    try:
        result = subprocess.check_output("ip addr", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_mac():
    try:
        mac = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff)
                for ele in range(0,8*6,8)][::-1])
        return mac
    except Exception:
        return "Unavailable"

def get_os():
    return platform.platform()

def get_device_model():
    loading_effect("Grabbing device model")
    try:
        if os.path.exists("/system/build.prop"):
            with open("/system/build.prop") as f:
                for line in f:
                    if "ro.product.model" in line:
                        return line.split("=")[-1].strip()
        result = subprocess.check_output("getprop ro.product.model", shell=True).decode().strip()
        return result if result else "Unavailable"
    except Exception:
        return "Unavailable"

def get_architecture():
    return platform.machine()

def get_android_id():
    loading_effect("Getting Android ID")
    try:
        result = subprocess.check_output("settings get secure android_id", shell=True).decode().strip()
        return result
    except Exception:
        return "Unavailable"

def get_battery():
    try:
        result = subprocess.check_output("termux-battery-status", shell=True).decode().strip()
        return result
    except Exception:
        return "Unavailable"

def get_network_info():
    try:
        result = subprocess.check_output("termux-wifi-connectioninfo", shell=True).decode().strip()
        return result
    except Exception:
        return "Unavailable"

def get_wifi_scan():
    try:
        result = subprocess.check_output("termux-wifi-scaninfo", shell=True).decode().strip()
        return result
    except Exception:
        return "Unavailable"

def get_storage():
    try:
        total, used, free = shutil.disk_usage("/")
        return f"Total: {total // (2**30)} GB | Used: {used // (2**30)} GB | Free: {free // (2**30)} GB"
    except Exception:
        return "Unavailable"

def get_uptime():
    try:
        with open("/proc/uptime") as f:
            uptime = float(f.readline().split()[0])
            hours = int(uptime // 3600)
            minutes = int((uptime % 3600) // 60)
            return f"{hours}h {minutes}m"
    except Exception:
        try:
            result = subprocess.check_output("uptime", shell=True).decode().strip()
            return result
        except Exception:
            return "Unavailable"

def get_installed_pkgs():
    loading_effect("Enumerating installed packages")
    try:
        pkgs = subprocess.check_output(["pkg", "list-installed"]).decode()
        pkgs = pkgs.splitlines()
        return pkgs
    except Exception:
        return ["Unavailable"]

def get_kernel():
    try:
        result = subprocess.check_output("uname -a", shell=True).decode().strip()
        return result
    except Exception:
        return "Unavailable"

def get_env():
    try:
        loading_effect("Collecting environment variables")
        envs = os.environ
        return '\n'.join([f"{k}: {v}" for k,v in envs.items()])
    except Exception:
        return "Unavailable"

def get_cpuinfo():
    try:
        with open("/proc/cpuinfo") as f:
            return f.read()
    except Exception:
        try:
            result = subprocess.check_output("lscpu", shell=True).decode().strip()
            return result
        except Exception:
            return "Unavailable"

def get_meminfo():
    try:
        with open("/proc/meminfo") as f:
            return f.read()
    except Exception:
        try:
            result = subprocess.check_output("free -h", shell=True).decode().strip()
            return result
        except Exception:
            return "Unavailable"

def get_running_services():
    try:
        result = subprocess.check_output("ps -aux", shell=True).decode()
        return result
    except Exception:
        try:
            result = subprocess.check_output("ps", shell=True).decode()
            return result
        except Exception:
            return "Unavailable"

def get_users():
    try:
        result = subprocess.check_output("who", shell=True).decode().strip()
        return result if result else "Unavailable"
    except Exception:
        return "Unavailable"

def get_shell():
    try:
        return os.environ.get('SHELL', 'Unavailable')
    except Exception:
        return "Unavailable"

def get_timezone():
    try:
        result = subprocess.check_output("date +%Z", shell=True).decode().strip()
        return result
    except Exception:
        return "Unavailable"

def get_hostname():
    try:
        return socket.gethostname()
    except Exception:
        return "Unavailable"

def get_python_version():
    return sys.version

def get_disk_partitions():
    try:
        result = subprocess.check_output("df -h", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_lastlog():
    try:
        result = subprocess.check_output("lastlog", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_recent_logs():
    logs = []
    try:
        for log_path in ["/var/log/syslog", "/var/log/messages", "/var/log/dmesg"]:
            if os.path.exists(log_path):
                with open(log_path) as f:
                    logs.append(f"\n--- {log_path} ---\n" + ''.join(f.readlines()[-10:]))
        return '\n'.join(logs) if logs else "No logs found."
    except Exception:
        return "Unavailable"

def get_user_home():
    try:
        return os.path.expanduser("~")
    except Exception:
        return "Unavailable"

def get_login_user():
    try:
        return getpass.getuser()
    except Exception:
        return "Unavailable"

def get_group_info():
    try:
        import grp
        groups = [g.gr_name for g in grp.getgrall() if get_login_user() in g.gr_mem]
        return ', '.join(groups) if groups else "Unavailable"
    except Exception:
        return "Unavailable"

def get_active_connections():
    try:
        result = subprocess.check_output("ss -tunap", shell=True).decode()
        return result
    except Exception:
        try:
            result = subprocess.check_output("netstat -tunap", shell=True).decode()
            return result
        except Exception:
            return "Unavailable"

def get_crontab():
    try:
        result = subprocess.check_output("crontab -l", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_temp_files():
    try:
        temp_dir = "/tmp"
        files = os.listdir(temp_dir)
        return ', '.join(files[:10]) if files else "None"
    except Exception:
        return "Unavailable"

def get_mounts():
    try:
        with open("/proc/mounts") as f:
            return f.read()
    except Exception:
        return "Unavailable"

def get_process_tree():
    try:
        result = subprocess.check_output("pstree -p", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_loaded_modules():
    try:
        result = subprocess.check_output("lsmod", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_sudoers():
    try:
        with open("/etc/sudoers") as f:
            return ''.join(f.readlines()[:15])
    except Exception:
        return "Unavailable"

def get_filesystem_type():
    try:
        result = subprocess.check_output("df -T", shell=True).decode()
        return result
    except Exception:
        return "Unavailable"

def get_hidden_files():
    try:
        home = get_user_home()
        files = [f for f in os.listdir(home) if f.startswith('.')]
        return ', '.join(files[:15])
    except Exception:
        return "Unavailable"

def main():
    os.system("clear")
    print(BANNER)
    separator()
    print_section("DEVICE & CORE")
    print_info("Model:", get_device_model())
    print_info("Android ID:", get_android_id())
    print_info("OS:", get_os())
    print_info("Arch:", get_architecture())
    print_info("Kernel:", get_kernel())
    print_info("Hostname:", get_hostname())
    print_info("Shell:", get_shell())
    print_info("Timezone:", get_timezone())
    print_info("Uptime:", get_uptime())
    print_info("User Login:", get_login_user())
    print_info("User Home:", get_user_home())
    print_info("Groups:", get_group_info())
    print_info("Hidden Files:", get_hidden_files())
    separator()
    print_section("NETWORK")
    print_info("Local IP:", get_local_ip())
    print_info("External IP:", get_external_ip())
    print_info("MAC Address:", get_mac())
    print_info("All IPs:\n", get_all_ips())
    print_info("Active Connections:\n", get_active_connections())
    print_info("Network Info:\n", get_network_info())
    print_info("WiFi Scan:\n", get_wifi_scan())
    separator()
    print_section("STORAGE & SYSTEM")
    print_info("Storage:", get_storage())
    print_info("Disk Partitions:\n", get_disk_partitions())
    print_info("Filesystem Type:\n", get_filesystem_type())
    print_info("Mounts:\n", get_mounts()[:400] + "...")
    print_info("Temp Files:", get_temp_files())
    separator()
    print_section("PACKAGES & SERVICES")
    print_info("Installed Packages (first 15):", "")
    pkgs = get_installed_pkgs()
    for pkg in pkgs[:15]:
        print(f"{CYAN}{pkg}{RESET}")
    print_info("Running Services:", "")
    print(f"{MAGENTA}{get_running_services()[:500]}...{RESET}")
    print_info("Process Tree:", "")
    print(f"{MAGENTA}{get_process_tree()[:500]}...{RESET}")
    print_info("Loaded Modules:", "")
    print(f"{MAGENTA}{get_loaded_modules()[:200]}...{RESET}")
    print_info("Crontab:\n", get_crontab())
    print_info("Sudoers (first 15 lines):\n", get_sudoers())
    separator()
    print_section("BATTERY & HARDWARE")
    print_info("Battery:", get_battery())
    print_info("CPU Info:\n", get_cpuinfo()[:400] + "...")
    print_info("Memory Info:\n", get_meminfo()[:400] + "...")
    separator()
    print_section("ENVIRONMENT & LOGS")
    print_info("Env Variables:\n", get_env()[:400] + "...")
    print_info("Python Version:", get_python_version())
    print_info("Lastlog:\n", get_lastlog()[:400] + "...")
    print_info("Recent System Logs:\n", get_recent_logs()[:400] + "...")
    separator()
    print(f"\n{BOLD}{CYAN}{UNDER}D E V I N F O   -   S Y S T E M   R E P O R T   C O M P L E T E{RESET}\n")
    print(f"{WHITE}Review complete. {RESET}\n")
    time.sleep(0.7)

if __name__ == "__main__":
    main()