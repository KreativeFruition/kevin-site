import clsx from 'clsx'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('skeleton rounded-2xl bg-ink/5', className)} />
)
