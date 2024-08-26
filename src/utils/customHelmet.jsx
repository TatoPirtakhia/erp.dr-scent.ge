import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import translate from "../translate/tr_function"

const CustomHelmet = (props) => {
    const { t } = useTranslation()
    const { title } = props
    return (
        <Helmet>
            <title> {`${translate(t,title)}${title ? ' | ' : ''} Dr. Scent`}</title>
        </Helmet>
    )

}

export default CustomHelmet