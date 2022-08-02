
export const useConsole = () : { log : ( input : any ) => void  } => 
{
    const log = ( input :any ) : void => 
    {
        console.log( input );
    }

    return {
        log
    }
}