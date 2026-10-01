import Swal from 'sweetalert2'

export type DestructiveConfirmationOptions = {
  title: string
  text: string
  confirmButtonText: string
  cancelButtonText: string
}

export async function confirmDestructiveAction(options: DestructiveConfirmationOptions): Promise<boolean> {
  const result = await Swal.fire({
    title: options.title,
    text: options.text,
    icon: 'warning',
    showCancelButton: true,
    reverseButtons: true,
    focusCancel: true,
    heightAuto: false,
    scrollbarPadding: false,
    confirmButtonText: options.confirmButtonText,
    cancelButtonText: options.cancelButtonText,
    confirmButtonColor: 'rgb(var(--v-theme-error))',
    cancelButtonColor: 'rgb(var(--v-theme-primary))',
    background: 'rgb(var(--v-theme-cardBackground))',
    color: 'rgb(var(--v-theme-on-cardBackground))',
  })

  return result.isConfirmed
}
