import React from 'react';
import '../styles.css';

export default function RecipeCardSkeleton() {
  return (
    <div className="recipe-card skeleton">
      <div className="recipe-header">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line rating"></div>
      </div>
      <div className="recipe-content">
        <div className="skeleton-section">
          <div className="skeleton-line heading"></div>
          <div className="skeleton-line text"></div>
          <div className="skeleton-line text short"></div>
          <div className="skeleton-line text"></div>
        </div>
        <div className="skeleton-section">
          <div className="skeleton-line heading"></div>
          <div className="skeleton-line text"></div>
          <div className="skeleton-line text"></div>
          <div className="skeleton-line text short"></div>
        </div>
      </div>
    </div>
  );
}