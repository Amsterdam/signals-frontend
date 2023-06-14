export function validateIsBlocking(controls: any, name: string, trigger: any) {
  const control = controls[name]
  if (control && control.meta?.validators) {
    const blockingValidators = control.meta.validators.find(
      (validator: any) => validator === 'isBlockingAnswer'
    )

    if (blockingValidators) {
      trigger(name)
    }
  }
}
