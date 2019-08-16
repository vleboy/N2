const exec = require('child_process').exec
const execOptions = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 20000 * 1024,// 最大缓存:20MB
    killSignal: 'SIGTERM',
    cwd: null,
    env: null
}
const http = require('http')
const server = http.createServer((async (req, res) => {
    // 构建
    try {
        await gitPull()
        // deployWeb('admin')
        // deployWeb('agent')
        // deployWeb('player')
        deployServer('server')
    } catch (error) {
        console.error('构建异常：')
        console.error(error)
    }
    // 响应
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Y")
}))
server.listen(1000)
console.log('启动持续集成服务 ...')

// const PROJECT_ROOT = '/usr/dev/N2'
const PROJECT_ROOT = '/usr/local/N2'

function gitPull() {
    console.info('开始执行 git pull ...')
    return new Promise((reslove, reject) => {
        const commands = [
            `cd ${PROJECT_ROOT}`,
            'git pull',
        ].join(' && ')
        exec(commands, execOptions, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                reject(error)
            }
            if (stdout) {
                console.info(`stdout: ${stdout}`)
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`)
            }
            reslove(stdout)
        })
    })
}

function deployWeb(project) {
    console.info(`开始打包 ${project} ...`)
    return new Promise((reslove, reject) => {
        const commands = [
            `cd ${PROJECT_ROOT}/${project}`,
            'npm run build'
        ].join(' && ')
        exec(commands, execOptions, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                reject(error)
            }
            if (stdout) {
                console.info(`stdout: ${stdout}`)
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`)
            }
            reslove(stdout)
        })
    })
}

function deployServer(project) {
    console.info(`重启服务 ${project} ...`)
    return new Promise((reslove, reject) => {
        const commands = [
            `cd ${PROJECT_ROOT}/${project}`,
            'npm run compose-server'
        ].join(' && ')
        exec(commands, execOptions, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                reject(error)
            }
            if (stdout) {
                console.info(`stdout: ${stdout}`)
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`)
            }
            reslove(stdout)
        })
    })
}