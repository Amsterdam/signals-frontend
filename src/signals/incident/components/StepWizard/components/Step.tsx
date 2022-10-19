export default function Step({
  render,
  id,
}: {
  render: () => JSX.Element | null
  id: string
}) {
  return <div id={id}>{render()}</div>
}
