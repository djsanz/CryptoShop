export const GetDebugLvl = (_Debug = null) => {
    if (process.env.NODE_ENV === 'development'){
        if (_Debug !== null){return _Debug}
        return 2
    }else{
        return 0
    }
}