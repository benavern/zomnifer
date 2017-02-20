// https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/System_Administrators_Guide/sect-Managing_Services_with_systemd-Power.html
module.exports = {
    shutdown: 'systemctl --no-wall poweroff',
    sleep:    'systemctl suspend',
    resart:   'systemctl --no-wall reboot'
}