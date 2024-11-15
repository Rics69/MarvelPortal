import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    onLoaded = (newCharacters) => {
        let end = false;
        if (newCharacters.length < 9) {
            end = true;
        }

        this.setState(({characters, offset}) => ({
            characters: [...characters, ...newCharacters], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: end
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
         this.setState({newItemLoading: true});
    }

    itemsRefs = [];

    setRef = (ref) => {
        this.itemsRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemsRefs.forEach(item => {
            item.classList.remove('char__item_selected');
        });

        this.itemsRefs[id].classList.add('char__item_selected');
        this.itemsRefs[id].focus();
    }

    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {characters, loading, error, newItemLoading, offset, charEnded} = this.state;

        const elements = this.renderItems(characters);

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
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

// const CharItem = ({id, name, thumbnail, onCharSelected}) => {
//     let objectFitStyle = "";

//     if (thumbnail.indexOf("image_not_available") > -1) {
//         objectFitStyle += "contain";
//     }else {
//         objectFitStyle += "cover";
//     }

//     return (
//         <li className="char__item" onClick={() => onCharSelected(id)}>
//             <img src={thumbnail} style={{objectFit: objectFitStyle}} alt={name}/>
//             <div className="char__name">{name}</div>
//         </li>
//     )
// }

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
};

export default CharList;