# Welcome to Emojify 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/paulospx/loglevel2emoji)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/paulospx/loglevel2emoji/blob/main/LICENSE)
[![Twitter: paulospx](https://img.shields.io/twitter/follow/paulospx.svg?style=social)](https://twitter.com/paulospx)

> Adding emojis to your log levels.
> Replaces your log levels by emojis.

| Emoji | Log Level | Description                                                  |
| ----- | --------- | ------------------------------------------------------------ |
| 🦟     | DEBUG     | less granular compared to the TRACE level, but it is more than you will  need in everyday use. The DEBUG log level should be used for information that may be needed for diagnosing issues and troubleshooting or when  running application in the test environment for the purpose of making  sure everything is running correctly |
| ℹ️     | INFO      | the standard log level indicating that something happened, application  entered a certain state, etc. For example, a controller of your  authorization API may include an INFO log level with information on  which user requested authorization if the authorization was successful  or not. The information logged using the INFO log level should be purely informative and not looking into them on a regular basis shouldn’t  result in missing any important information. |
| ⚠️     | WARNING   | the log level that indicates that something unexpected happened in the  application, a problem, or a situation that might disturb one of the  processes. But that doesn’t mean that the application failed. The WARN  level should be used in situations that are unexpected, but the code can continue the work. For example, a parsing error occurred that resulted  in a certain document not being processed. |
| 💩     | ERROR     | the log level that should be used when the application hits an issue  preventing one or more functionalities from properly functioning. The  ERROR log level can be used when one of the payment systems is not  available, but there is still the option to check out the basket in the  e-commerce application or when your social media logging option is not  working for some reason. |
| 😠     | CRITICAL  | the log level happens when a certain defined number of errors occurs. This means that the CRITICAL level has been reached and some resiliency mechanism should be started, not starting this mechanism will be fatal. |
| 💀     | FATAL     | the log level that tells that the application encountered an event or  entered a state in which one of the crucial business functionality is no longer working. A FATAL log level may be used when the application is  not able to connect to a crucial data store like a database or all the  payment systems are not available and users can’t checkout their baskets in your e-commerce. |
### 🏠 [Homepage](https://github.com/paulospx/loglevel2emoji)

### ✨ [Demo](https://paulospx.github.io/loglevel2emoji/)
# Usage

Create a bookmark on your browser with the following address:

    javascript:(function(){var d=document,s=d.createElement('script');s.src='https://paulospx.github.io/loglevel2emoji/emoji_log_level.js';d.body.appendChild(s);}())

## Author

👤 **Paulo P.**

* Twitter: [@paulospx](https://twitter.com/paulospx)
* Github: [@paulospx](https://github.com/paulospx)
* LinkedIn: [@https:\/\/www.linkedin.com\/in\/ppaixao\/](https://linkedin.com/in/https:\/\/www.linkedin.com\/in\/ppaixao\/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/paulospx/loglevel2emoji/issues). You can also take a look at the [contributing guide](https://github.com/paulospx/loglevel2emoji/issues).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2021 [Paulo P.](https://github.com/paulospx).

This project is [MIT](https://github.com/paulospx/loglevel2emoji/blob/main/LICENSE) licensed.