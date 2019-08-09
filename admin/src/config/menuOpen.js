export const menuOpen = function(name) {
  let openName = []
  if (name == 'home') {
    openName = ['home']
  } else if (name == 'adminList' || name == 'adminRole') {
    openName = ['adminCenter']
  }
  return openName
}
