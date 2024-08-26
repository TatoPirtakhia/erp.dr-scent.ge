
const IsVatPayer = ({ height, width, onClick }) => {
    return (
        <img src='/img/rs.png' width={width} height={height} alt='RS Logo' style={{ cursor: 'pointer' }} onClick={onClick} />
    )
}
export default IsVatPayer