import { server } from './http'
import './websocket'

server.listen(3333, () => console.log('server is running on port 3333'))