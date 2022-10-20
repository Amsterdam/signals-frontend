// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
export default function Step({
  render,
  id,
}: {
  render: () => JSX.Element | null
  id: string
}) {
  return <div id={id}>{render()}</div>
}
