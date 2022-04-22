import * as React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Tips = styled.div`
  line-height: 56px;
  padding-top: 120px;
  text-align: center;
`

const Loading = () => {
    const { t } = useTranslation();
    return <Tips>{ t('Loading') }...</Tips>;
};

export default Loading;