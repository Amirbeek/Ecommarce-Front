import {BounceLoader, PacmanLoader, PulseLoader,CircleLoader} from "react-spinners";

export default function Spinner({fullWidth}) {
    if (fullWidth){
        return (
            <div className={'w-full flex justify-center'}>
                <CircleLoader color={'#1E3A8A'} speedMultiplier={2} />
            </div>
        )
    }
    return (
        <CircleLoader color={'#1E3A8A'} speedMultiplier={2} />
    );
}
