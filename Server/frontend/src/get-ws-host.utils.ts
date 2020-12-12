
const SERVER_HOST = 'ws://localhost:2567';

export const getWsHost = () => {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if ( process.env.NODE_ENV !== 'development') {
    const host = window.document.location.host.replace(/:.*/, '');
    const client = (location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : ''));

    return client + location.pathname.replace('index.html', '')
  }
  return SERVER_HOST;
}
