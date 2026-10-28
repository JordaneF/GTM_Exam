/* =====================================================================
   MES TAGS — votre fichier pour la partie 3 de l'examen (e-commerce)
   ---------------------------------------------------------------------
   Ce fichier est chargé sur toutes les pages de la boutique.
   Écrivez ici vos crochets shopHooks et vos dataLayer.push.
   La liste des crochets est en annexe du sujet (examen.html).

   Rappels :
   - commencez chaque crochet par un console.log(data) ;
   - une seule erreur dans ce fichier bloque TOUT le fichier :
     ouvrez la console (F12) si plus rien ne remonte.
   ===================================================================== */
window.dataLayer = window.dataLayer || [];
window.shopHooks = window.shopHooks || {};


/* ---------- Écrivez votre code ci-dessous ---------- */


/* Le dictionnaire : vocabulaire de la boutique → vocabulaire GA4 */
function versItem(x) {
  return {
    item_id: x.sku,
    item_name: x.name,
    item_brand: x.brand,
    item_category: x.category,
    item_variant: x.size,       // vide quand on regarde un produit sans taille choisie
    price: x.price,
    quantity: x.quantity || 1   // 1 par défaut
  };
  }


/* Fiche Produit */
shopHooks.viewItem = function (data) {
   var item = versItem(data.product);
   item.item_id = data.id;
   item.item_name = data.name;
   item.item_brand = data.brand;
   item.item_category = data.category;
   item.price = data.unitPrice;
   item.quantity = data.quantity;
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: "EUR",
      value: data.product.price,
      items: [item]
    }
  });
};

/*  Ajout au panier */
shopHooks.addToCart = function (data) {
  var item = versItem(data.product);
  item.item_variant = data.size;      // la taille choisie
  item.price = data.unitPrice;        // le prix, flocage compris
  item.quantity = data.quantity;      // la quantité ajoutée
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "EUR",
      value: data.value,
      items: [item]
    }
  });
};


/*  Début de commande */
shopHooks.beginCheckout = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "EUR",
      value: data.totals.subtotal - data.totals.discount,
      coupon: data.totals.coupon || undefined,
      items: data.lines.map(versItem)
    }
  });
};


/*Choix de la livraison */
shopHooks.addShippingInfo = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency: "EUR",
      value: data.totals.subtotal - data.totals.discount,
      coupon: data.totals.coupon || undefined,
      shipping_tier: data.shippingTier,
      items: data.lines.map(versItem)
    }
  });
};


/* Choix du paiement */
shopHooks.addPaymentInfo = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "add_payment_info",
    ecommerce: {
      currency: "EUR",
      value: data.totals.subtotal - data.totals.discount,
      coupon: data.totals.coupon || undefined,
      payment_type: data.paymentType,
      items: data.lines.map(versItem)
    }
  });
};


/* Achat */
shopHooks.purchase = function (data) {
  if (!data.firstView) return; // page rechargée : on n'envoie pas l'achat une 2e fois
  var o = data.order;
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: o.transaction_id,
      currency: o.currency,
      value: Math.round((o.total - o.shipping) * 100) / 100,
      tax: o.tax,
      shipping: o.shipping,
      coupon: o.coupon || undefined,
      items: o.lines.map(versItem)
    }
  });
};


shopHooks.couponApplied = function (data) {
  dataLayer.push({
    event: "coupon_applied",
    coupon_code: data.coupon,
    coupon_valid: data.valid ? "oui" : "non"
  });
};

