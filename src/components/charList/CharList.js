import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    onLoaded = (characters) => {
        this.setState({
            characters, 
            loading:false
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    onUpdateList = () => {
        this.marvelService.getAllCharacters().then(this.onLoaded).catch(this.onError);
    }

    componentDidMount() {
        this.onUpdateList();
    }

    render() {

        const {characters, loading, error} = this.state;

        console.log(characters);

        const elements = characters.map(char => {
            const id = Math.floor(Math.random() * (1000000 - 1) + 1);
            const {name, thumbnail} = char;
            return (
                <CharItem key={id} name={name} thumbnail={thumbnail}/>
            );
        })

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? elements : null;



        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const CharItem = ({name, thumbnail}) => {
    let objectFitStyle = "";

    if (thumbnail.indexOf("image_not_available") > -1) {
        objectFitStyle += "contain";
    }else {
        objectFitStyle += "cover";
    }

    return (
        <li className="char__item">
            <img src={thumbnail} style={{objectFit: objectFitStyle}} alt={name}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default CharList;