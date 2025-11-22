import React from 'react';
import { 
  Shield, TrendingUp, DollarSign, Lock, Activity, Home, Layers, CheckCircle, 
  Circle, AlertTriangle, User, Trophy, Zap, Star, Code, Cpu, Hammer, Pickaxe, 
  Sprout, Sparkles, Briefcase, X, Sword, Heart, Target, Users, LayoutDashboard, 
  ArrowRight, ArrowLeft, Flame, Edit3, Eye, EyeOff, Save, HelpCircle, Grid, List, 
  BookOpen, ChevronRight, Lock as LockIcon, Unlock, Droplet, Brain, Smile, Package, 
  Coffee, Smartphone, Monitor, CreditCard, Map, Scroll, FileKey, Dumbbell, Camera, 
  PenTool, Car, ShoppingBag, Plus, Headphones, Armchair, Book, HardDrive, Glasses, 
  Coins, Tag, Box, Dna, Hexagon, Server, Globe, Wifi, Database, Key, MousePointer, 
  GripVertical, Settings, Sliders, Crown, Gift, Building, Landmark, Gavel, Filter, 
  Watch, Mic, Library, Archive, Trash2 
} from 'lucide-react';

export const IconMap = {
  Code, AlertTriangle, Coffee, Wifi, Smile, Hexagon, Grid, FileKey,
  CheckCircle, Sparkles, Server, Lock, Key, Cpu, HardDrive, Brain, Globe,
  Database, Zap, Dna, Sword, Target, Shield, Heart, Star, Users,
  Pickaxe, Activity, Sprout, Hammer, Monitor, Dumbbell, Camera, PenTool, Car,
  Headphones, Armchair, Book, Glasses, Coins, Package, ShoppingBag, Flame,
  LayoutDashboard, User, MousePointer, Edit3, GripVertical, DollarSign, TrendingUp, Plus,
  Layers, X, ChevronRight, LockIcon, Unlock, Droplet, Map, Scroll, Settings, Sliders,
  Crown, Gift, Box, Building, Landmark, Gavel, List, Filter, Circle, ArrowRight, ArrowLeft,
  Briefcase, Watch, Mic, Library, Archive, Trash2, HelpCircle
};

export const RenderIcon = ({ name, size = 16, className = "" }) => {
  const IconComponent = IconMap[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

export const getRarityColor = (rarity) => {
  switch(rarity) {
      case 'Legendary': return 'text-amber-400 border-amber-500/50 bg-amber-900/20';
      case 'Epic': return 'text-purple-400 border-purple-500/50 bg-purple-900/20';
      case 'Rare': return 'text-blue-400 border-blue-500/50 bg-blue-900/20';
      case 'Uncommon': return 'text-emerald-400 border-emerald-500/50 bg-emerald-900/20';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/50';
  }
};

export const getRarityGradient = (rarity) => {
    switch(rarity) {
        case 'Legendary': return 'from-amber-900/50 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-900/20';
        case 'Epic': return 'from-purple-900/50 to-slate-900 border-purple-500/50 shadow-lg shadow-purple-900/20';
        case 'Rare': return 'from-blue-900/50 to-slate-900 border-blue-500/50 shadow-lg shadow-blue-900/20';
        case 'Uncommon': return 'from-emerald-900/50 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-900/20';
        default: return 'from-slate-800 to-slate-900 border-slate-700';
    }
};