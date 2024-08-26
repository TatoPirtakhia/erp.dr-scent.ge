import React from 'react';
import { useTranslation } from 'react-i18next'

const Translate = ({ id, fallback }) => {

	const { t } = useTranslation()

	const translate = t(id, fallback)
	
	return <>{translate}</>
}

export default Translate;