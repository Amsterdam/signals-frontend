import { themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export default styled.div`
  position: relative;

  .map-component {
    .map-container {
      position: relative;
      width: 100%;
      height: 450px;
    }

    &__loading {
      background-color: ${themeColor('tint', 'level3')};
      display: block;
      width: calc(100% - 30px); // padding left and right of grid
      height: 100%;
      position: absolute;
      z-index: 1001;
    }

    &.write {
      .object-marker:hover {
        filter: drop-shadow(0 0 2px #000000);
      }
    }

    .zoom-control,
    .legend-control,
    .loading-control,
    .error-control {
      border: 2px solid rgba(#000000, 0.02);
      background-clip: padding-box;
    }

    .zoom-control {
      background-color: ${themeColor('support', 'focus')};
      color: #000000;
      font-size: 16px;
      line-height: 22px;
      padding: 13px;
    }

    .legend-control {
      background-color: #ffffff;
      color: #000000;
      font-size: 16px;
      line-height: 16px;
      min-width: 240px;
    }

    .legend-header {
      padding: 14px;
      color: #000000;

      background-color: ${themeColor('tint', 'level2')};

      background-image: url('/assets/images/Chevron-Down.svg');
      background-position: right;
      background-repeat: no-repeat;
      background-size: 16px 16px;
      background-origin: content-box;

      &:hover,
      &:focus {
        background-color: ${themeColor('tint', 'level3')};
        color: #000000;
        fill: #000000;
        outline: none;
      }
    }

    .legend-content {
      background-color: #ffffff;
      padding: 5px 14px;
    }

    .legend-content-item {
      display: flex;
      align-items: center;
      height: 28px;
      line-height: 28px;
      margin: 10px 0;
    }

    .legend-content-icon-wrapper {
      display: flex;
      justify-content: center;
      min-width: 32px;
    }

    .legend-content-text {
      margin-left: 8px;
    }

    .legend-control {
      &.is-closed {
        .legend-header {
          background-image: url('/assets/images/Chevron-Top.svg');
        }

        .legend-content {
          display: none;
        }
      }
    }

    .loading-control {
      background-color: #ffffff;
      font-size: 16px;
      line-height: 22px;
      padding: 13px 17px;
    }

    .error-control {
      background-color: #ffffff;
      font-size: 16px;
      line-height: 22px;
      padding: 13px 17px;
    }

    .hide {
      display: none;
    }
  }
`
