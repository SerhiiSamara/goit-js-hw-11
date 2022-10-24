export default function onInfo(info) {
  Notiflix.Notify.info(`${info}`, {
    timeout: 2000,
  });
}
