import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { useContext } from 'react'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import ReportedLayer from '../../Asset/Selector/WfsLayer/ReportedLayer'
import AssetSelectContext from '../../Asset/context'

export const StreetlightLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })

  return (
    <>
      <AssetLayer featureTypes={meta.featureTypes} desktopView={desktopView} />
      <ReportedLayer featureTypes={meta.featureTypes} />
    </>
  )
}

export default StreetlightLayer
