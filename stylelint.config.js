module.exports = {
  defaultSeverity: 'error',
  plugins: [
    'stylelint-scss'
  ],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order'
  ],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  }
}
