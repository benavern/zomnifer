// http://apple.stackexchange.com/a/103633
module.exports = {
    shutdown: 'osascript -e \'tell app "System Events" to shut down\'',
    sleep:    'pmset sleepnow', // osascript -e 'tell app "System Events" to sleep'
    resart:   'osascript -e \'tell app "System Events" to restart\''
}